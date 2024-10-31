class Users::SessionsController < ApplicationController
    skip_before_action :verify_authenticity_token, only: [:create]

    def create
        user = User.find_for_database_authentication(email: params[:email])

        if user&.valid_password?(params[:password])
            render json: {
                message: 'Login successful',
                user: user.as_json(only: [:id, :username, :email, :cash, :liabilities]) 
            }, status: :ok
        else
            render json: { errors: ['Invalid email or password'] }, status: :unauthorized
        end
    end

    def destroy
        render json: { message: 'Logout successful' }, status: :ok
    end
end
