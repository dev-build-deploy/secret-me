// Known public values and placeholders: none of these may be reported.
const azurite =
  "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;";
const fromEnv = { token: process.env.TOKEN, password: "changeme" };
const placeholder = "postgres://user:password@localhost/app";
