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
      
      imageDate = image.name.replace('.jpg', '');
      const text = document.createTextNode(imageDate);
      const textElement = document.createElement('p');
      textElement.style.textAlign = 'center'; // center the text
      textElement.appendChild(text);

      listItem.appendChild(textElement); // add text above the image
      listItem.appendChild(img);
      imageList.appendChild(listItem);
    });
  });

  // Get the security status
  const securityToggle = document.getElementById("security-toggle");
  securityToggle.innerHTML = "Enabled";
  securityToggle.style.backgroundColor = "#27ae60";
  securityToggle.addEventListener("click", function() {
    fetch('/enable_security')
      .then(response => response.json())
      .then(data => {
        // Find the security toggle button

        // Toggle the security status
        let securityIsEnabled = Boolean(data.isEnabled);
        
        // Update the security toggle button text and color
        if (securityIsEnabled) {
          securityToggle.innerHTML = "Enabled";
          securityToggle.style.backgroundColor = "#27ae60";
        } else {
          securityToggle.innerHTML = "Disabled";
          securityToggle.style.backgroundColor = "#e74c3c";
        }
        
      });
  });
