class QuestionAnswer < ActiveRecord::Base
  # attr_accessible :title, :body
  set_table_name("QuestionAnswers")

  DATE_TIME_REG_EXP = /^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/

  validates_presence_of :question_id
  validates_presence_of :ticked
  validates_presence_of :date

  validates_numericality_of :question_id

  validates_format_of :date, :with => DATE_TIME_REG_EXP 

end
