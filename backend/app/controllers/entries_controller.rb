class EntriesController < ApplicationController
    before_action :set_user

    def create
    entry = user_entries_model.new(entry_params)

    if entry.save
        render json: entry, status: :created
    else
        render json: { errors: entry.errors.full_messages }, status: :unprocessable_entity
    end
    end

    def index
        entries = user_entries_model.all
        render json: entries, status: :ok
    end

    def show
        entry = user_entries_model.find(params[:id])
        render json: entry, status: :ok
        rescue ActiveRecord::RecordNotFound
        render json: { error: 'Entry not found' }, status: :not_found
    end

    def update
        entry = user_entries_model.find(params[:id])
        if entry.update(entry_params)
            render json: entry, status: :ok
        else
            render json: { errors: entry.errors.full_messages }, status: :unprocessable_entity
        end
        rescue ActiveRecord::RecordNotFound
        render json: { error: 'Entry not found' }, status: :not_found
    end

    def destroy
        entry = user_entries_model.find(params[:id])
        entry.destroy
        head :no_content
        rescue ActiveRecord::RecordNotFound
        render json: { error: 'Entry not found' }, status: :not_found
    end

    private

    def set_user
        @user = User.find_by(username: params[:username])
        render json: { error: 'User not found' }, status: :not_found unless @user
    end

    def user_entries_model
        @user.entries_model
    end

    def entry_params
        params.require(:entry).permit(:date, :entry_type, :description, :amount)
    end
end
