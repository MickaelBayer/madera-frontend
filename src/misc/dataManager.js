import api from '../Api';

export async function getAllUsers() {
  let allUsers = '';
  await api.getAllUser()
    .then((response) => {
      allUsers = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return allUsers;
}
