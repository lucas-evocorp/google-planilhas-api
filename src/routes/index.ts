import { Router } from "express";
import * as AuthGoogleUseCase from "../use-cases/auth-google.usecase";
import * as CreateSpreadSheet from "../use-cases/create-sheet.usecase";

import fs from "fs";

const router = Router();

router.get("/token", AuthGoogleUseCase.getToken);

router.get("/auth-google", AuthGoogleUseCase.execute);

router.get("/create-sheet", async (req, res) => {
  fs.readFile("credentials.json", (err, credentials: Buffer) => {
    fs.readFile("token.json", async (err, content: Buffer) => {
      const token = content;

      if (!token) {
        res.redirect("/auth-google");
      } else {
        const createSpread = await CreateSpreadSheet.createSheet(
          JSON.parse(String(content)),
          JSON.parse(String(credentials))
        );

        console.log(createSpread.url);

        res.redirect(createSpread.url);
      }
    });
  });
});

export default router;
