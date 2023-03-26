import smtplib
from email.message import EmailMessage


Sender_Email = "intelligentambientspt@gmail.com"
Reciever_Email = "intelligentambientspt@gmail.com"
Password = 'heqstnukntlmwpvq'
newMessage = EmailMessage()    #creating an object of EmailMessage class
newMessage['From'] = Sender_Email  #Defining sender email
newMessage['To'] = Reciever_Email  #Defining reciever email
newMessage['Subject'] = "Smart Attic Alert" 

def send_email():
    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(Sender_Email, Password)              
            smtp.send_message(newMessage)
    except Exception as ex:
        print ("Something went wrong….",ex)
    
def send_email_temperature_alert(temperature_value):
    newMessage.set_content(f'An unnusual temperature of {temperature_value} was detected in your attic.')
    send_email()

def send_email_humidity_alert(humidity_value):
    newMessage.set_content(f'An unnusual humidity of {humidity_value} was detected in your attic.')
    send_email()

def send_email_intruder_alert(filepath):
    newMessage.set_content('An intruder has been detected in your attic.')
    with open(filepath, 'rb') as f:
        image_data = f.read()
        image_name = f.name
    newMessage.add_attachment(image_data, maintype='image', subtype='jpg', filename=image_name)
    send_email()
