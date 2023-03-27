fetch('/get_th_data')
  .then(response => response.json())
  .then(data => {
    document.getElementById('temperature').innerText = data.temperature;
    document.getElementById('humidity').innerText = data.humidity;
  });

fetch('/get_images')
  .then(response => response.json())
  .then(data => {
    const imageList = document.getElementById('image-list');
    data.images.forEach(image => {
      const listItem = document.createElement('li');
      
      listItem.className = 'image-item';
      const img = document.createElement('img');
      img.src = `data:image/png;base64,${image.data}`;
      img.style.display = 'block'; 
      img.style.margin = '0 auto'; 
      img.style.width = '50%'; 
      imageDate = image.name.replace('.jpg', '');

      const text = document.createTextNode(imageDate);
      const textElement = document.createElement('p');
      textElement.style.textAlign = 'center'; 
      textElement.appendChild(text);

      listItem.appendChild(textElement); 
      listItem.appendChild(img);

      imageList.appendChild(listItem);
    });
  });

  const securityToggle = document.getElementById("security-toggle");
  // fetch enable security and if it is enabled style it accordingly

  fetch('/get_security_status')
  .then(response => response.json())
  .then(data => {
    let securityIsEnabled = Boolean(data.isEnabled);
    if (securityIsEnabled) {
      securityToggle.innerHTML = "Security Enabled";
      securityToggle.style.backgroundColor = "#27ae60";
    } else {
      securityToggle.innerHTML = "Security Disabled";
      securityToggle.style.backgroundColor = "#e74c3c";
    }
    
  });

  securityToggle.addEventListener("click", function() {
    fetch('/enable_security')
      .then(response => response.json())
      .then(data => {
        let securityIsEnabled = Boolean(data.isEnabled);
        if (securityIsEnabled) {
          securityToggle.innerHTML = "Security Enabled";
          securityToggle.style.backgroundColor = "#27ae60";
        } else {
          securityToggle.innerHTML = "Security Disabled";
          securityToggle.style.backgroundColor = "#e74c3c";
        }
        
      });
  });
