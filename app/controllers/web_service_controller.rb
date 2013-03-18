class WebServiceController < ApplicationController

	def getData
		theDb = Client.authenticate(params[:username], params[:password]) 

		theDb = theDb.connection.select_all("SELECT * FROM Clients
											JOIN ClientSites
											ON Clients.id = ClientSites.client_id
											JOIN InspectionPoints
											ON ClientSites.id = InspectionPoints.clientSite_id
											JOIN TestSources
											ON InspectionPoints.id = TestSources.inspectionPoint_id
											JOIN Questions
											ON TestSources.id = Questions.testSource_id
											WHERE Clients.id = " + theDb.id.to_s)
				

		json = ActiveSupport::JSON.encode(theDb)
			
		render :json => json
	end

	def getClientData
		theDb = Client.authenticate(params[:username], params[:password]) 

		json = ActiveSupport::JSON.encode(theDb)
			
		render :json => json
	end

	def getClientSiteData
		theDb = Client.authenticate(params[:username], params[:password]) 

		theData = ClientSite.where(["client_id = ?", theDb.id ])

		json = ActiveSupport::JSON.encode(theData)
			
		render :json => json
	end

	def getInspectionPointData
		theDb = Client.authenticate(params[:username], params[:password]) 

		theData = InspectionPoint.joins("JOIN ClientSites
											ON InspectionPoints.clientSite_id = ClientSites.id").where(
											["ClientSites.client_id = ?", theDb.id ])



		json = ActiveSupport::JSON.encode(theData)
			
		render :json => json
	end

	def getTestSourceData
		theDb = Client.authenticate(params[:username], params[:password]) 

		theData = TestSource.joins("JOIN InspectionPoints
									ON TestSources.inspectionPoint_id = InspectionPoints.id
									JOIN ClientSites
									ON InspectionPoints.clientSite_id = ClientSites.id").where(
									["ClientSites.client_id = ?", theDb.id ])



		json = ActiveSupport::JSON.encode(theData)
			
		render :json => json
	end

	def getQuestionData
		theDb = Client.authenticate(params[:username], params[:password]) 

		theData = Question.joins("JOIN TestSources
									ON Questions.testSource_id = TestSources.id
									JOIN InspectionPoints
									ON TestSources.inspectionPoint_id = InspectionPoints.id
									JOIN ClientSites
									ON InspectionPoints.clientSite_id = ClientSites.id").where(
									["ClientSites.client_id = ?", theDb.id ])

		json = ActiveSupport::JSON.encode(theData)
			
		render :json => json
	end

	def authenticate
		authorizedClient = Client.authenticate(params[:username], params[:password]) 

		if authorizedClient
			json = ActiveSupport::JSON.encode(true)
			render :json => json
			return true
		else
			json = ActiveSupport::JSON.encode(false)
			render :json => json
			return false
		end
	end

	#post data
	def postData
		theDb = Client.authenticate(params[:username], params[:password]) 
	end
end
