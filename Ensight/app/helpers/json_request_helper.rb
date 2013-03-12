module JsonRequestHelper
	def getClientSideWhere
		#clientSiteID
		#if(params[:clientSiteID] == nil) 
			return "" 
		#else 
		#	return "AND WHERE ClientSites.id = '" + params[:clientSiteID]  + "' "
		#end
		
	end
end
