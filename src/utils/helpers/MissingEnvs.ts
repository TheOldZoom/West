async function MissingEnvs(envs: string[]) {
  const missingEnvs = envs.filter((env) => !process.env[env]);
  return missingEnvs;
}

export default MissingEnvs;
