class IndexController < ApplicationController
#before_filter :confirm_logged_in, :except => []
skip_before_filter  :verify_authenticity_token

	def index
		if session[:clientname] && session[:id]
			user = Client.where('id = ?', session[:id])
		else
			return
		end
	end

	def fireTheSproc
		ActiveRecord::Base.connection.select_all("CALL add_new_random_reading")

		sleep 15
		ActiveRecord::Base.connection.select_all("CALL LEAVE add_new_random_reading;")

	end
end
