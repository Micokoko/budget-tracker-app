class Users::RegistrationsController < ApplicationController
    def create
        @user = User.new(user_params)
        if @user.save
            render json: { message: "User registered successfully" }, status: :created
        else
            error_messages = @user.errors.messages
            response_errors = {}

            if error_messages[:username]&.include?("has already been taken")
                response_errors[:username] = "Username is already taken"
            end

            if error_messages[:email]&.include?("has already been taken")
                response_errors[:email] = "Email address is already in use"
            end

            render json: { errors: response_errors.empty? ? @user.errors.full_messages : response_errors }, status: :unprocessable_entity
        end
    end

    private

    def user_params
        params.require(:user).permit(:username, :email, :password, :password_confirmation, :cash, :liabilities)
    end
end
