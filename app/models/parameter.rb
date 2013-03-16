class Parameter < ActiveRecord::Base
  # attr_accessible :title, :body
  belongs_to :InspectionPoint
  set_table_name("Parameters")

  validates_presence_of :parameterType
  validates_presence_of :unitMeasurement

  validates_length_of :parameterType, :maximum => 100
  validates_length_of :unitMeasurement, :maximum => 30

  
end
