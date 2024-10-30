class EntriesController < ApplicationController
    before_action :set_user
    before_action :set_entry, only: [:destroy, :update, :show]

    def create
        @entry = @user.entries.new(entry_params)

        if @entry.save
            adjust_user_finances(@entry)
            render json: @entry, status: :created
        else
            render json: @entry.errors, status: :unprocessable_entity
        end
    end

    def index
        entries = @user.entries
        entries = entries.where(date: params[:date]) if params[:date].present?
        render json: entries
    rescue StandardError => e
        logger.error "Error fetching entries: #{e.message}"
        render json: { error: 'Internal server error' }, status: :internal_server_error
    end

    def show
        render json: @entry
    end

    def update
        old_entry = @entry.dup
    
        if @entry.update(entry_params)
            adjust_user_finances_for_update(old_entry, @entry)  
            render json: { message: 'Entry updated successfully', entry: @entry }, status: :ok
        else
            render json: { error: 'Failed to update entry' }, status: :unprocessable_entity
        end
    end

    def destroy
        adjust_user_finances(@entry, undo: true)
    
        if @entry.destroy
            render json: { message: 'Entry deleted successfully' }, status: :ok
        else
            render json: { error: 'Failed to delete entry' }, status: :unprocessable_entity
        end
    end

    private

    def set_user
        Rails.logger.info "Params: #{params.inspect}"
        @user = User.find_by(username: params[:username])
        unless @user
            render json: { error: 'User not found' }, status: :not_found and return
        end
    end

    def set_entry
        @entry = @user.entries.find_by(id: params[:id])
        render json: { error: 'Entry not found' }, status: :not_found unless @entry
    end

    def entry_params
        params.permit(:date, :entry_type, :description, :amount)
    end


    def adjust_user_finances(entry, undo: false)
        factor = undo ? -1 : 1
        
        case entry.entry_type
        when 'Income'
          @user.cash += factor * entry.amount
        when 'Expense'
          @user.cash -= factor * entry.amount
        when 'Liability'
          @user.liabilities += factor * entry.amount
        when 'Settlement'
          @user.liabilities -= factor * entry.amount
          @user.cash -= factor * entry.amount
        end
    
        @user.cash = [@user.cash, 0].max
        @user.liabilities = [@user.liabilities, 0].max
        @user.update_columns(cash: @user.cash, liabilities: @user.liabilities)
    end

    def adjust_user_finances_for_update(old_entry, new_entry)
        User.transaction do

        case old_entry.entry_type
            when 'Income'
            @user.cash -= old_entry.amount
        when 'Expense'
            @user.cash += old_entry.amount  
        when 'Liability'
            @user.liabilities -= old_entry.amount
        when 'Settlement'
            @user.liabilities += old_entry.amount 
            @user.cash += old_entry.amount
        end

        case new_entry.entry_type
        when 'Income'
            @user.cash += new_entry.amount
        when 'Expense'
            @user.cash -= new_entry.amount  
        when 'Liability'
            @user.liabilities += new_entry.amount
        when 'Settlement'
            @user.liabilities -= new_entry.amount 
            @user.cash -= new_entry.amount
        end


        @user.cash = [@user.cash, 0].max
        @user.liabilities = [@user.liabilities, 0].max

        @user.update_columns(cash: @user.cash, liabilities: @user.liabilities)
        end
    end
    
end
