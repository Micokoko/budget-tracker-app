class UsersController < ApplicationController
  # Ensure user is authenticated for all actions except index
  before_action :authenticate_user!, except: [:index]

  def index
    @users = User.all
    render json: @users  # Render users as JSON
  end

  def current
    render json: { name: current_user.name }
  end
end
