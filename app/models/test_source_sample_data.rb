class TestSourceSampleData < ActiveRecord::Base
  # attr_accessible :title, :body
  belongs_to :TestSource
  set_table_name("TestSourceSampleData")

  DATE_TIME_REG_EXP = /^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/


  validates_presence_of :testSource_id
  validates_presence_of :dateTimeTaken
  validates_presence_of :dateTimeRecieved
  validates_presence_of :reading

  validates_numericality_of :reading
  validates_numericality_of :testSource_id

  validates_format_of :dateTimeRecieved, :with => DATE_TIME_REG_EXP
  validates_format_of :dateTimeTaken,  :with => DATE_TIME_REG_EXP

end
