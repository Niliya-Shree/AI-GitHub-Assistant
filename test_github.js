// test_github.js
import { fetchFromGitHub } from "./github.js";

async function test() {
  try {
    // Try fetching your authenticated user
    const user = await fetchFromGitHub("/user");
    console.log("✅ Authenticated as:", user.login);

    // Try fetching a public user's data
    const octocat = await fetchFromGitHub("/users/octocat");
    console.log("📦 Octocat info:", octocat);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

test();
