import { ref } from 'vue'
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next'
import { addFeedback, updateFeedback, deleteFeedback, addFeedbackComment, deleteFeedbackComment, likeFeedback } from '@/api/feedback.js'

/**
 * Feedback 操作逻辑
 */
export function useFeedbackActions(fetchFeedbackList) {
  // 新建/编辑反馈
  const showNewFeedbackDialog = ref(false)
  const isEditMode = ref(false)
  const newFeedback = ref({
    title: '',
    type: 'bug',
    content: '',
    contactInfo: ''
  })

  // 打开新建反馈对话框
  const handleNewFeedback = () => {
    isEditMode.value = false
    newFeedback.value = {
      title: '',
      type: 'bug',
      content: '',
      contactInfo: ''
    }
    showNewFeedbackDialog.value = true
  }

  // 打开编辑反馈对话框
  const handleEditFeedback = (feedback) => {
    isEditMode.value = true
    newFeedback.value = {
      id: feedback.id,
      title: feedback.title,
      type: feedback.type,
      content: feedback.content,
      contactInfo: feedback.contactInfo || ''
    }
    showNewFeedbackDialog.value = true
  }

  // 提交反馈
  const handleSubmitFeedback = async () => {
    // 验证表单
    if (!newFeedback.value.title.trim()) {
      await MessagePlugin.warning('请输入标题')
      return
    }
    if (!newFeedback.value.content.trim()) {
      await MessagePlugin.warning('请输入详细描述')
      return
    }

    try {
      let res
      if (isEditMode.value) {
        res = await updateFeedback(newFeedback.value.id, newFeedback.value)
      } else {
        res = await addFeedback(newFeedback.value)
      }

      if (res.success || res.code === 200) {
        await MessagePlugin.success(isEditMode.value ? '反馈已更新' : '反馈已提交')
        showNewFeedbackDialog.value = false
        fetchFeedbackList()
      } else {
        await MessagePlugin.error(res.message || '操作失败')
      }
    } catch (error) {
      console.error('提交反馈失败:', error)
      await MessagePlugin.error('操作失败，请重试')
    }
  }

  // 取消反馈表单
  const handleCancelNew = () => {
    showNewFeedbackDialog.value = false
  }

  // 删除反馈
  const handleDeleteFeedback = async (feedback) => {
    const confirmDialog = DialogPlugin.confirm({
      header: '确认删除',
      body: `确认删除反馈"${feedback.title}"？删除后无法恢复。`,
      confirmBtn: '删除',
      cancelBtn: '取消',
      theme: 'warning',
      onConfirm: async () => {
        try {
          const res = await deleteFeedback(feedback.id)
          if (res.success || res.code === 200) {
            await MessagePlugin.success('删除成功')
            fetchFeedbackList()
            confirmDialog.destroy()
          } else {
            await MessagePlugin.error(res.message || '删除失败')
          }
        } catch (error) {
          console.error('删除反馈失败:', error)
          await MessagePlugin.error('删除失败，请重试')
        }
      }
    })
  }

  // 点赞/取消点赞
  const handleLike = async (feedback) => {
    try {
      const res = await likeFeedback(feedback.id)
      if (res.success || res.code === 200) {
        feedback.liked = !feedback.liked
        feedback.likes = (feedback.likes || 0) + (feedback.liked ? 1 : -1)
        await MessagePlugin.success(feedback.liked ? '已点赞' : '已取消点赞')
      } else {
        await MessagePlugin.error(res.message || '操作失败')
      }
    } catch (error) {
      console.error('点赞失败:', error)
      await MessagePlugin.error('操作失败，请重试')
    }
  }

  // 添加评论
  const handleAddCommentInline = async (feedback) => {
    if (!feedback.newCommentText || !feedback.newCommentText.trim()) {
      await MessagePlugin.warning('请输入评论内容')
      return
    }

    try {
      const res = await addFeedbackComment({
        feedbackId: feedback.id,
        content: feedback.newCommentText
      })

      if (res.success || res.code === 200) {
        await MessagePlugin.success('评论已添加')
        feedback.newCommentText = ''
        fetchFeedbackList()
      } else {
        await MessagePlugin.error(res.message || '添加评论失败')
      }
    } catch (error) {
      console.error('添加评论失败:', error)
      await MessagePlugin.error('添加评论失败，请重试')
    }
  }

  // 删除评论
  const handleDeleteCommentInline = async (feedbackId, commentId) => {
    const confirmDialog = DialogPlugin.confirm({
      header: '确认删除',
      body: '确认删除该评论？删除后无法恢复。',
      confirmBtn: '删除',
      cancelBtn: '取消',
      theme: 'warning',
      onConfirm: async () => {
        try {
          const res = await deleteFeedbackComment(commentId)
          if (res.success || res.code === 200) {
            await MessagePlugin.success('删除成功')
            fetchFeedbackList()
            confirmDialog.destroy()
          } else {
            await MessagePlugin.error(res.message || '删除失败')
          }
        } catch (error) {
          console.error('删除评论失败:', error)
          await MessagePlugin.error('删除失败，请重试')
        }
      }
    })
  }

  return {
    showNewFeedbackDialog,
    isEditMode,
    newFeedback,
    handleNewFeedback,
    handleEditFeedback,
    handleSubmitFeedback,
    handleCancelNew,
    handleDeleteFeedback,
    handleLike,
    handleAddCommentInline,
    handleDeleteCommentInline
  }
}
