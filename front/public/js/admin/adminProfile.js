const userProfile = document.querySelector('#picture');
const uploadName = document.querySelector('.upload_name');

userProfile.addEventListener('change', (e) => {
  console.log(e.target.value);
  uploadName.placeholder = e.target.value;
});
