fetch('/get_th_data')
  .then(response => response.json())
  .then(data => {
    document.getElementById('temperature').innerText = data.temperature;
    document.getElementById('humidity').innerText = data.humidity;
  });

// Get the image history
// fetch('/images')
//   .then(response => response.json())
//   .then(data => {
//     const imageList = document.getElementById('image-list');
//     data.images.forEach(image => {
//       const listItem = document.createElement('li');
//       listItem.className = 'image-item';
//       const img = document.createElement('img');
//       img.src = `data:image/png;base64,${image}`;
//       listItem.appendChild(img);
//       imageList.appendChild(listItem);
//     });
//   });