/**
 * Generated by orval v7.5.0 🍺
 * Do not edit manually.
 * SAM2 Segmentation API
 * SAM2を用いたセグメンテーションを行うAPI
 * OpenAPI spec version: 1.0.0
 */
import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type {
  ApplyPromptsApiSegmentationApplyPost200,
  ExportVideoApiSegmentationExportPost200,
  ExportVideoApiSegmentationExportPostParams,
  InitializeVideoApiSegmentationInitializePostParams,
  Prompt,
  PropagatePromptsApiSegmentationPropagatePost200,
  PropagatePromptsApiSegmentationPropagatePostParams,
  ResetStateApiSegmentationResetPut200,
  VideoInfo,
} from ".././schema";

/**
 * @summary Initialize Video
 */
export const initializeVideoApiSegmentationInitializePost = <TData = AxiosResponse<VideoInfo>>(
  params: InitializeVideoApiSegmentationInitializePostParams,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.post(`/api/segmentation/initialize`, undefined, {
    ...options,
    params: { ...params, ...options?.params },
  });
};
/**
 * @summary Apply Prompts
 */
export const applyPromptsApiSegmentationApplyPost = <
  TData = AxiosResponse<ApplyPromptsApiSegmentationApplyPost200>,
>(
  prompt: Prompt[],
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.post(`/api/segmentation/apply`, prompt, options);
};
/**
 * @summary Propagate Prompts
 */
export const propagatePromptsApiSegmentationPropagatePost = <
  TData = AxiosResponse<PropagatePromptsApiSegmentationPropagatePost200>,
>(
  params: PropagatePromptsApiSegmentationPropagatePostParams,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.post(`/api/segmentation/propagate`, undefined, {
    ...options,
    params: { ...params, ...options?.params },
  });
};
/**
 * @summary Reset State
 */
export const resetStateApiSegmentationResetPut = <
  TData = AxiosResponse<ResetStateApiSegmentationResetPut200>,
>(
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.put(`/api/segmentation/reset`, undefined, options);
};
/**
 * @summary Export Video
 */
export const exportVideoApiSegmentationExportPost = <
  TData = AxiosResponse<ExportVideoApiSegmentationExportPost200>,
>(
  params: ExportVideoApiSegmentationExportPostParams,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.post(`/api/segmentation/export`, undefined, {
    ...options,
    params: { ...params, ...options?.params },
  });
};
export type InitializeVideoApiSegmentationInitializePostResult = AxiosResponse<VideoInfo>;
export type ApplyPromptsApiSegmentationApplyPostResult =
  AxiosResponse<ApplyPromptsApiSegmentationApplyPost200>;
export type PropagatePromptsApiSegmentationPropagatePostResult =
  AxiosResponse<PropagatePromptsApiSegmentationPropagatePost200>;
export type ResetStateApiSegmentationResetPutResult =
  AxiosResponse<ResetStateApiSegmentationResetPut200>;
export type ExportVideoApiSegmentationExportPostResult =
  AxiosResponse<ExportVideoApiSegmentationExportPost200>;
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
