import { google } from "googleapis";
import fs from "fs";
import EventEmitter from "events";
import { Itoken } from "../interfaces/I-token.interface";
import { Icredentials } from "../interfaces/i-credentials.interface";

interface ICreateSheetResponse {
  url: string
}

const eventEmitter = new EventEmitter();
export const createSheet = async (token: Itoken, credentials: Icredentials): Promise<ICreateSheetResponse> => {
 
 
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  oAuth2Client.setCredentials(token);

  const service = google.sheets({ version: "v4", auth: oAuth2Client });
 
  const resource = {
    properties: {
      title: "modelo zaut colaboradores",
    },
  };
 
  try {
    const spreadsheet = await service.spreadsheets.create({
      requestBody: resource,
      fields: "spreadsheetId",
    });

    const spreadsheetId = spreadsheet.data.spreadsheetId;
    
    await writeSheetValues(
      spreadsheetId,
      "A:A",
      "USER_ENTERED",
      token,
      credentials
    );
    
    return {
      url: `https://docs.google.com/spreadsheets/d/${spreadsheet.data.spreadsheetId}/edit#gid=0`,
    };
  
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
};

const writeSheetValues = async (
  spreadsheetId: any,
  range: any,
  valueInputOption: any,
  token: any,
  credentials: any
) => {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  oAuth2Client.setCredentials(token);

  const service = google.sheets({ version: "v4", auth: oAuth2Client });

  const values = [
    "CPF*",
    "Primeiro nome*",
    "Último nome*",
    "Data de nascimento* Ex: 30/01/2000",
    "Nome da mãe",
    "Email*",
    "Telefone com ddd Ex: (84) 99999-9999",
    "Número do whatsapp Ex: (84) 99999-9999",
    "CEP* Ex: 99999-999",
    "Cidade*",
    "UF*",
    "Endereço*",
    "Número*",
    "Bairro*",
    "Complemento",
  ];

  try {
    const spreadsheet = await service.spreadsheets.values.append({
      spreadsheetId,
      range,
      requestBody: { values: [values] },
      valueInputOption,
    });

    return spreadsheet;
  } catch (err) {
    // TODO (Developer) - Handle exception
    throw err;
  }
};
