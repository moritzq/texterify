class Api::V1::ExportConfigsController < Api::V1::ApiController
  def index
    project = current_user.projects.find(params[:project_id])

    authorize ExportConfig.new(project_id: project.id)

    export_configs = project.export_configs.order_by_name
    options = {}
    options[:include] = [:language_configs]
    render json: ExportConfigSerializer.new(export_configs, options).serialized_json
  end

  def create
    project = current_user.projects.find(params[:project_id])

    export_config = ExportConfig.new(export_config_params)
    export_config.project = project

    authorize export_config

    if export_config.save
      render json: ExportConfigSerializer.new(export_config).serialized_json
    else
      render json: {
        errors: export_config.errors.details
      }, status: :bad_request
    end
  end

  def update
    project = current_user.projects.find(params[:project_id])
    export_config = project.export_configs.find(params[:id])

    authorize export_config

    if export_config.update(export_config_params)
      render json: ExportConfigSerializer.new(export_config).serialized_json
    else
      render json: {
        errors: export_config.errors.details
      }, status: :bad_request
    end
  end

  def destroy
    project = current_user.projects.find(params[:project_id])
    export_config = project.export_configs.find(params[:id])

    authorize export_config

    if export_config.destroy
      render json: {
        success: true
      }
    else
      render json: {
        errors: export_config.errors.details
      }, status: :bad_request
    end
  end

  private

  def export_config_params
    params.require(:export_config).permit(:name, :file_format, :file_path, :default_language_file_path)
  end
end
