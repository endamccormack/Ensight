class InspectionPoint < ActiveRecord::Base
	belongs_to :ClientSite
   	attr_accessible :inspectionPointDescription, :clientSite_id

 	validates_presence_of :inspectionPointDescription
   	validates_presence_of :clientSite_id
   	validates_presence_of :inspectionPointLocationLatitude
   	validates_presence_of :inspectionPointLocationLongtitude

   	validates_numericality_of :inspectionPointLocationLatitude
	validates_numericality_of :inspectionPointLocationLongtitude

    set_table_name("InspectionPoints")
end



