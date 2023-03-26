fetch('/get_th_data')
  .then(response => response.json())
  .then(data => {
    document.getElementById('temperature').innerText = data.temperature;
    document.getElementById('humidity').innerText = data.humidity;
  });

//Get the image history
fetch('/get_images')
  .then(response => response.json())
  .then(data => {
    const imageList = document.getElementById('image-list');
    data.images.forEach(image => {
      const listItem = document.createElement('li');
      listItem.className = 'image-item';
      const img = document.createElement('img');
      img.src = `data:image/png;base64,${image.data}`;
      img.style.display = 'block'; // center the image
      img.style.margin = '0 auto'; // center the image
      img.style.width = '50%'; // set a specific size for the image
      const text = document.createTextNode(image.name);
      const textElement = document.createElement('p');
      textElement.style.textAlign = 'center'; // center the text
      textElement.appendChild(text);
      listItem.appendChild(textElement); // add text above the image
      listItem.appendChild(img);
      imageList.appendChild(listItem);
    });
  });