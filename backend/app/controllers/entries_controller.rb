    class EntriesController < ApplicationController
    before_action :set_user

    def create
        @entry = @user.entries_model.new(entry_params)

        if @entry.save
            update_user_finances(@entry)
            render json: @entry, status: :created
        else
            render json: @entry.errors, status: :unprocessable_entity
        end
    end

    private

    def set_user
        @user = User.find_by(username: params[:username])
        render json: { error: 'User not found' }, status: :not_found unless @user
    end

    def entry_params
    params.require(:entry).permit(:date, :entry_type, :description, :amount)
    end

    def update_user_finances(entry)
        case entry.entry_type
        when 'Income'
            @user.cash += entry.amount
        when 'Expense'
            @user.cash -= entry.amount
        when 'Liability'
            @user.liabilities += entry.amount
        end


        @user.cash = [@user.cash, 0].max
        @user.liabilities = [@user.liabilities, 0].max

        @user.update_columns(cash: @user.cash, liabilities: @user.liabilities)
    end

end