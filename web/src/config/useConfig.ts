const getConfig = () => {
  const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID!;

  return {
    projectId,
  };
};
export default getConfig;
