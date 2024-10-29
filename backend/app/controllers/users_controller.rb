class UsersController < ApplicationController
  before_action :authenticate_user!, except: [:index]

  def index
    @users = User.all
    render json: @users 
  end

  def current
    render json: { username: current_user.username }
  end
end
