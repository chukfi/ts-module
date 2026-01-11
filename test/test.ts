import { describe } from "node:test";
import Chukfi from "../index";
import { User } from "../src/types/types";

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

describe("GetUserSchemas", async () => {
  await Login("admin@nativeconsult.io", "chukfi123");

  const schemasOrError =
    await chukfi.requests.collections.GetTableSchema("users");

  if (schemasOrError instanceof Error) {
    throw schemasOrError;
  }
  console.log("User Schemas:", schemasOrError);
});

describe("GetAllCollections", async () => {
  await Login("admin@nativeconsult.io", "chukfi123");
  const allSchemasOrError =
    await chukfi.requests.collections.GetAllCollections();

  if (allSchemasOrError instanceof Error) {
    throw allSchemasOrError;
  }
  console.log("All Schemas:", allSchemasOrError);
});

describe("CreateCollectionEntry", async () => {
  await Login("admin@nativeconsult.io", "chukfi123");
  const newEntryOrError =
    await chukfi.requests.collections.CreateCollectionEntry<User>("users", {
      Fullname: "Test User",
      Email: `testuser${Date.now()}@example.com`,
      Password: "securepassword",
      Permissions: 1,
    });

  if (newEntryOrError instanceof Error) {
    throw newEntryOrError;
  }
  console.log("New User Entry:", newEntryOrError);
});

describe("GetCollectionData", async () => {
    await Login("admin@nativeconsult.io", "chukfi123");

    const dataOrError = await chukfi.requests.collections.GetCollectionData<User>("users");

    if (dataOrError instanceof Error) {
      throw dataOrError;
    }
    console.log("Users Data:", dataOrError);
});