// const { test } = require('../src/obImg2ghImg.jts')
// const { isExistRemote } = test;
// import {describe} from 'vitest'
// import {} from ''
// import {} from '@/index'
import { isExistRemote } from "@src/index"
// import {isExistRemote} from '@/'
// import {} from '@/index'
describe("test function isExistRemote", () => {
  it("云端存在图片", () => {
    expect(
      isExistRemote(
        "https://raw.githubusercontent.com/tangqiang0605/test/main/static/Pasted%20image%2020230914083939.png",
      ),
    ).resolves.toBe(true)
  })
  it("url不存在图片", () => {
    expect(
      isExistRemote(
        "https://raw.githubusercontent.com/tangqiang0605/test/main/static/Pasted%20image%thispictureshouldbenotfound.png",
      ),
    ).resolves.toBe(false)
  })
  it("传入非法url", () => {
    expect(isExistRemote("aaa")).rejects.toMatchInlineSnapshot(`[TypeError: Invalid URL]`)
  })
})
