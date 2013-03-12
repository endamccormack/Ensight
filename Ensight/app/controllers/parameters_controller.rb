class ParametersController < ApplicationController
	before_filter :confirm_logged_in
	def list
		@parameters = getTheParameter

		if !session[:isAdmin] == true
			@questions = @questions.where(['ClientSites.client_id = ?', session[:id]])
		end

	end

	def show
		@parameter = Parameter.find(params[:id])
	end

	def new
		@parameter = Parameter.new
	end

	def create
		@parameter = Parameter.new
		@parameter.parameterType = params[:parameter][:parameterType]
		@parameter.unitMeasurement = params[:parameter][:unitMeasurement]

		if @parameter.save
			redirect_to(:action => 'list')
		else
			render('new')
		end

	end

	def edit
		@parameter = Parameter.find(params[:id])
	end

	def update
		@parameter = Parameter.find(params[:id])

		@parameter.parameterType = params[:parameter][:parameterType]
		@parameter.unitMeasurement = params[:parameter][:unitMeasurement]

		if @parameter.save
			redirect_to(:action => 'show', :id => @parameter.id)
		else
			redirect_to(:action => 'edit')
		end
	end

	def delete
		@parameter = Parameter.find(params[:id])
	end

	def destroy
		@parameter = Parameter.find(params[:id])
		if @parameter.destroy
			redirect_to(:action => 'list')
		else
			redirect_to(:action => 'delete')
		end
	end

	def getTheParameter
		getinspectionPoints= Parameter.joins('INNER JOIN TestSources ON
											Parameters.id = TestSources.parameter_id
											INNER JOIN InspectionPoints ON
											TestSources.inspectionPoint_id = InspectionPoints.id
											INNER JOIN ClientSites ON
											InspectionPoints.clientSite_id = ClientSites.id
											INNER JOIN Clients ON
											ClientSites.client_id = Clients.id')
		return getinspectionPoints
	end
end
