import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get( "/filteredimage/", async ( req: Request, res: Response ) => {
    const image_url: string = req.query.image_url;

    // image basic validation
    if ( !image_url ) {
      return res.status(400)
                .send(`Image url is required`);
    }

    try {
      // compress user's image
      const compressedImagePath: string = await filterImageFromURL(image_url);
      
      res.sendFile(compressedImagePath, () =>
          deleteLocalFiles([compressedImagePath])
      );
    }
    catch(error) {
      console.log(error);
      res.sendStatus(422).send("Image url specified cannot be processed.");
    }
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
