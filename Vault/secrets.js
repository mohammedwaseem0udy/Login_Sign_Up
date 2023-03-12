const { SecretClient } = require("@azure/keyvault-secrets");
const { DefaultAzureCredential } = require("@azure/identity");
let dotenv = require('dotenv');
dotenv.config();

async function loadSecret() {
  const credential = new DefaultAzureCredential();
  const keyVaultName = process.env.KEY_VALUT_NAME;
  if(!keyVaultName) 
    throw new Error("KEY_VAULT_NAME is empty");

  const url = "https://" + keyVaultName + ".vault.azure.net";
  const client = new SecretClient(url, credential);
  let secretName = process.env.VAULT_SECRET_NAME;
  const secret = await client.getSecret(secretName);
  process.env["JWT_SECRET"] = secret.value;
}

module.exports = {
    loadSecret: loadSecret
}