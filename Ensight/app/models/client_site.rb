class ClientSite < ActiveRecord::Base
	belongs_to :Client
  # attr_accessible :title, :body
  	validates_presence_of :client_id
  	validates_presence_of :clientSiteName
  	validates_presence_of :clientSiteAddress
  	validates_presence_of :clientSiteLocationLatitude
  	validates_presence_of :clientSiteLocationLongtitude

  	validates_length_of :clientSiteAddress, :maximum => 100
  	validates_numericality_of :clientSiteLocationLatitude
  	validates_numericality_of :clientSiteLocationLongtitude

   set_table_name("ClientSites")

 
end
