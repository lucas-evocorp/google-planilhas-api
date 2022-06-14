import { Request, Response } from "express";
import { Router } from "express";
import { google, oauth2_v2 } from "googleapis";
import path from "path/posix";
import fs from "fs";
import readline from "readline";
import * as CreateSpreadSheetUseCase from "../use-cases/create-sheet.usecase";

import EventEmitter from "events";
import { Icredentials } from "../interfaces/i-credentials.interface";
import { Itoken } from "../interfaces/I-token.interface";
const eventEmitter = new EventEmitter();

export const getToken = (req: Request, res: Response) => {
  const auth = req.query.code;

  if (!auth) {
    res.sendStatus(401).send({
      message:
        "ocorreu um erro na autenticação, por favor, tente novamente mais tarde!",
    });
  } else {
    eventEmitter.emit("get-token", auth);

    console.log("você foi autenticado");

    setTimeout(() => {
      res.redirect("/create-sheet");
    }, 2000);
  }
};

export const execute = (req: Request, res: Response): void => {
  const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

  const TOKEN_PATH = "token.json";

  fs.readFile("credentials.json", (err, content: Buffer) => {
    if (err) return console.error("Error loading client secret file:", err);
    authorize(JSON.parse(String(content)));
  });

  function authorize(credentials: Icredentials) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );
    console.log(oAuth2Client);

    fs.readFile(TOKEN_PATH, (err, token: Buffer) => {
      if (err) return getNewToken(oAuth2Client);

      oAuth2Client.setCredentials(JSON.parse(String(token)));

      return oAuth2Client;
    });
  }

  async function getNewToken(oAuth2Client: any) {
    try {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
      });

      res.redirect(authUrl);

      eventEmitter.on("get-token", (auth: string) => {
        oAuth2Client.getToken(auth, (err: Error, token: Itoken) => {
          if (err)
            return console.error(
              "Error while trying to retrieve access token",
              err
            );
          oAuth2Client.setCredentials(token);

          fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log(token);

            console.log("Token stored to", TOKEN_PATH);
          });
        });
      });
      res.status(200).send({ auth: oAuth2Client });
      return oAuth2Client;
    } catch (error) {
      console.error("ocorreu um erro na autenticação");
    }
  }
};
