const userProfile = document.querySelector('#picture');
const uploadName = document.querySelector('.upload_name');

userProfile.addEventListener('change', (e) => {
  uploadName.placeholder = e.target.value;
});
