async function getMembersInfo() {
  try {
      const response = await fetch("./src/data.json");
      return response.json();
  } catch (error) {
      console.log(error);
  }
}
