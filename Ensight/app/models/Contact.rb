class Contact < ActiveRecord::Base
  # attr_accessible :title, :body
  set_table_name("Contacts")
  
  EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,7}$/i

  validates_presence_of :contactName
  validates_presence_of :contactEmail
  validates_presence_of :contactPhone
  validates_presence_of :contactPosition

  validates_length_of :contactName, :maximum => 40
  validates_length_of :contactEmail, :maximum => 50
  validates_length_of :contactPhone, :maximum => 20
  validates_length_of :contactPosition, :maximum => 40

  validates_format_of :contactEmail, :with => EMAIL_REGEX

end
