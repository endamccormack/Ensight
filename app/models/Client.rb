require 'digest/sha1'
class Client < ActiveRecord::Base
  # attr_accessible :title, :body
   set_table_name("Clients")

   validates_presence_of :clientName
   validates_uniqueness_of :clientName
   validates_length_of :clientName, :maximum => 40

   validates_presence_of :clientPassword
   validates_length_of :clientPassword, :maximum => 255

   validates_presence_of :clientAddress

   validates_presence_of :clientAddress
   validates_presence_of :salt


   def self.make_salt(username="")
   		Digest::SHA1.hexdigest("Put salt in chuck norris's eyes and you will end at #{Time.now} Mr #{username} ")
   end

   def self.hash(password="", salt="")
   		Digest::SHA1.hexdigest("have some #{salt} for your #{password}")
   end

   attr_protected :hashedPassword, :salt
   
   def self.authenticate (username="", password="")
   		aClient = Client.find_by_clientName(username)
   		#returns nil if not found
         if(aClient == nil)
            return false
         end

   		hashedPassword = Client.hash(password, aClient.salt)
   		if aClient && aClient.clientPassword == hashedPassword
   			return aClient
   		else
   			return false
   		end	

   end


end
