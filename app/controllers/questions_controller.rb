class QuestionsController < ApplicationController

	before_filter :confirm_logged_in	
	def list

		#filters
		@questions = Question.joins('INNER JOIN TestSources ON TestSources.id = Questions.testSource_id INNER JOIN InspectionPoints ON TestSources.inspectionPoint_id = InspectionPoints.id INNER JOIN ClientSites ON InspectionPoints.clientSite_id = ClientSites.id')

		if !session[:isAdmin] == true
			@questions = @questions.where(['ClientSites.client_id = ?', session[:id]])
		end

		if(params[:clientSite_id] != '' && params[:clientSite_id] != nil)
			params[:theClientSite_id] = params[:clientSite_id]
			@questions = @questions.where(['ClientSites.id = ?', params[:clientSite_id]])
		end

		if(params[:inspectionPoint_id] != '' && params[:inspectionPoint_id] != nil)
			params[:theInspectionPoint_id] = params[:inspectionPoint_id]
			@questions = @questions.where(['InspectionPoints.id = ?', params[:inspectionPoint_id]])
		end

		if(params[:testSource_id] != '' && params[:testSource_id] != nil)
			params[:theTestSource_id] = params[:testSource_id]
			@questions = @questions.where(['TestSources.id = ?', params[:testSource_id]])
		end

	end

	def show
		@question = Question.find(params[:id])
	end

	def new

		if @question == nil
			@question = Question.new
		end
	end

	def create
		@question = Question.new
		@question.questionDescription = params[:question][:questionDescription]
		@question.testSource_id = params[:testSource_id]

		if !@question.valid?
			render('new')
		else
			if @question.save
				redirect_to(:action => 'list')
			else
				render('new')
			end
		end
	end

	def edit
		@question = Question.find(params[:id])

	end

	def update
		@question = Question.find(params[:id])


		@question.questionDescription = params[:question][:questionDescription]
		@question.testSource_id = params[:testSource_id]

		if(!@question.valid?)
			render('edit')
		else
			if @question.save
				redirect_to(:action => 'show', :id => @question.id)
			else
				render('edit')
			end
		end
	end

	def delete
		@question = Question.find(params[:id])

	end

	def destroy
		@question = Question.find(params[:id])
		if @question.destroy
			redirect_to(:action => 'list')
		else
			redirect_to(:action => 'delete')
		end
	end




end
