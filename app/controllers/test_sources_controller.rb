class TestSourcesController < ApplicationController
	before_filter :confirm_logged_in
	def list
		#filters
		@testSources = TestSource.joins('INNER JOIN InspectionPoints ON TestSources.inspectionPoint_id = InspectionPoints.id INNER JOIN ClientSites ON InspectionPoints.clientSite_id = ClientSites.id')

		if !session[:isAdmin] == true
			@testSources = @testSources.where(['ClientSites.client_id = ?', session[:id]])
		end

		if(params[:clientSite_id] != '' && params[:clientSite_id] != nil)
			params[:theClientSite_id] = params[:clientSite_id]
			@testSources = @testSources.where(['ClientSites.id = ?', params[:clientSite_id]])
		end

		if(params[:inspectionPoint_id] != '' && params[:inspectionPoint_id] != nil)
			params[:theInspectionPoint_id] = params[:inspectionPoint_id]
			@testSources = @testSources.where(['InspectionPoints.id = ?', params[:inspectionPoint_id]])
		end
	end

	def show
		@testSource = TestSource.find(params[:id])
	end

	def new
		@testSource = TestSource.new
	end

	def create
		@testSource = TestSource.new

		@testSource.testSourceLocationDescription = params[:testSource][:testSourceLocationDescription]
		@testSource.inspectionPoint_id = params[:testSource][:inspectionPoint_id]
		@testSource.testSourceLowerLimit = params[:testSource][:testSourceLowerLimit]
		@testSource.testSourceUpperLimit = params[:testSource][:testSourceUpperLimit]
		@testSource.testSourceLocationLatitude = params[:testSource][:testSourceLocationLatitude]
		@testSource.testSourceLocationLongtitude = params[:testSource][:testSourceLocationLongtitude]
		@testSource.parameter_id = params[:parameter_id]
		@testSource.inspectionPoint_id = params[:inspectionPoint_id]

		if !@testSource.valid?
			render('new')
		else
			if @testSource.save
				redirect_to(:action => 'list')
			else
				render('new')
			end
		end

	end

	def edit
		@testSource = TestSource.find(params[:id])
	end

	def update
		@testSource = TestSource.find(params[:id])

		@testSource.testSourceLocationDescription = params[:testSource][:testSourceLocationDescription]
		@testSource.inspectionPoint_id = params[:testSource][:inspectionPoint_id]
		@testSource.testSourceLowerLimit = params[:testSource][:testSourceLowerLimit]
		@testSource.testSourceUpperLimit = params[:testSource][:testSourceUpperLimit]
		@testSource.testSourceLocationLatitude = params[:testSource][:testSourceLocationLatitude]
		@testSource.testSourceLocationLongtitude = params[:testSource][:testSourceLocationLongtitude]
		@testSource.parameter_id = params[:parameter_id]
		@testSource.inspectionPoint_id = params[:inspectionPoint_id]

		if @testSource.save
			redirect_to(:action => 'show', :id => @testSource.id)
		else
			render('edit')
		end
	end

	def delete
		@testSource = TestSource.find(params[:id])
	end

	def destroy
		@testSource = TestSource.find(params[:id])
		if @testSource.destroy
			redirect_to(:action => 'list')
		else
			redirect_to(:action => 'delete')
		end
	end

	def getTheParameter
		getTheParameter = TestSource.join('INNER JOIN InspectionPoints ON
											TestSources.inspectionPoint_id = InspectionPoints.id
											INNER JOIN ClientSites ON
											InspectionPoints.clientSite_id = ClientSites.id
											INNER JOIN Clients ON
											ClientSites.client_id = Clients.id')
		getinspectionPoints = getinspectionPoints.where('Clients.client_id = ?', session[:id])

		return getinspectionPoints
	end
end
