class TestSource < ActiveRecord::Base
  # attr_accessible :title, :body
  	belongs_to :InspectionPoint
  	set_table_name("TestSources")
    
  	validates_presence_of :parameter_id
  	validates_presence_of :inspectionPoint_id
  	validates_presence_of :testSourceLowerLimit
  	validates_presence_of :testSourceUpperLimit
  	validates_presence_of :testSourceLocationLatitude
  	validates_presence_of :testSourceLocationLongtitude
  	validates_presence_of :testSourceLocationDescription

	validates_length_of :testSourceLocationDescription, :maximum => 100

	validates_numericality_of :testSourceLocationLongtitude
	validates_numericality_of :testSourceLocationLatitude
	validates_numericality_of :testSourceLowerLimit
  	validates_numericality_of :testSourceUpperLimit

end