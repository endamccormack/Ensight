class Question < ActiveRecord::Base
  # attr_accessible :title, :body
  set_table_name("Questions")

  validates_presence_of :testSource_id
  validates_presence_of :questionDescription

  validates_numericality_of :testSource_id

  validates_length_of :questionDescription, :maximum => 100

end
