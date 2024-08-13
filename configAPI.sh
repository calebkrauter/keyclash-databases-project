# Generated from Claude AI.
echo Configuring API Url as an enviornment variable for the current session.
export API_URL=$(aws ssm get-parameter --name /myapp/api-url --query Parameter.Value --output text)