import type { KnowledgePage, KnowledgeParams } from '@/types/consult'
import { request } from '@/utils/request'

// 获取首页文章列表
export const getKnowledgePage = (params: KnowledgeParams) =>
  request<KnowledgePage>('patient/home/knowledge', 'get', params)
