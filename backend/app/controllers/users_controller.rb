class UsersController < ApplicationController
  before_action :authenticate_user!, except: [:index]

  def index
    @users = User.all
    render json: @users 
  end

  def current
    render json: { name: current_user.name }
  end
end
