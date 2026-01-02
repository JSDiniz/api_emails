import app from "./app";
import "dotenv/config";

(async () => {
  const PORT = process.env.PORT || 3000;


  app.listen(PORT, () => console.log("Servidor executando"));
})();