import { describe } from "node:test";
import Chukfi from "../index";

const chukfi = new Chukfi("http://localhost:3000");

async function Login(email: string, password: string) {
  const userOrError = await chukfi.requests.auth.login(email, password);
  if (userOrError instanceof Error) {
    throw userOrError;
  }
  console.log("Logged in user:", userOrError);

  console.log("Is properly instance?", chukfi.loggedInUser);

  if (!chukfi.loggedInUser) {
    throw new Error("No logged in user after login");
  }
}

describe("Login", async () => {
  await Login("admin@nativeconsult.io", "chukfi123");
});

describe("WhoAmI", async () => {
  await Login("admin@nativeconsult.io", "chukfi123");

  const userOrError = await chukfi.requests.auth.whoAmI();
  if (userOrError instanceof Error) {
    throw userOrError;
  }
  console.log("WhoAmI user:", userOrError);

  if (!chukfi.loggedInUser) {
    throw new Error("No logged in user after whoAmI");
  }
});
