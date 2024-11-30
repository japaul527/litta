
// import express from "express";
// import bodyParser from "body-parser";
// import router from "./routes";

// const app = express();
// app.use(bodyParser.json());

// app.use("/api", router);

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// export default app;

import app from "./app"; 

const PORT = 3000;

// Start the server only if this file is executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app; // Export the app for testing
