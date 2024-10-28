class Users::RegistrationsController < ApplicationController
  def create
      @user = User.new(user_params)
      if @user.save
          # Handle successful registration
      else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
      end
  end

  private

  def user_params
      params.require(:user).permit(:name, :username, :email, :password, :password_confirmation, :cash, :liabilities)
  end
end
