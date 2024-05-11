import express from "express";
import expressWs from "express-ws";
import cors from "cors";

const app = express();
expressWs(app);

const port = 8000;

app.use(cors());

const router = express.Router();

router.ws('/paint', (ws, req) => {
  console.log('client connected');

  ws.on('close', () => {
      console.log('client disconnected');
  });
});

app.use(router);

app.listen(port, () => {
    console.log(`server running on ${port} port.`);
});