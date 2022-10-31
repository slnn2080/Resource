<template>
  <ValidationObserver ref="createShortUrlForm" v-slot="{ dirty, invalid }" slim>
    <div class="mt-4 mb-4">
      <div class="card mb-4">
        <div class="card-header header-light">
          {{ displayLang.CREATE_SHORTURL_TITLE }}
        </div>
        <div class="card-body">
          <div class="form-row">
            <div class="form-group col-8">
              <label for="urlkey">{{ displayLang.CREATE_SHORTURL_URLKEY }}</label>
              <input type="text" class="form-control" id="urlkey" v-model="url_key" />
            </div>
          </div>
          <hr />
          <div class="form-row">
            <div class="form-group col-8">
              <label for="target">{{ displayLang.CREATE_SHORTURL_SERVER }}</label>
              <input
                type="text"
                class="form-control"
                id="target"
                :placeholder="displayLang.CREATE_SHORTURL_PLACEHOLDER"
                v-model="target"
              />
            </div>
          </div>
          <hr />
          <div class="form-row">
            <div class="form-group col-4">
              <ValidationProvider
                ref="actorInput"
                v-slot="{ dirty, invalid }"
                rules="required"
                slim
              >
                <label for="actor">{{
                  displayLang.CREATE_SHORTURL_LOGIN_CATEGORY
                }}</label>
                <select
                  id="actor"
                  v-model="actor"
                  class="form-control"
                  :class="[dirty && invalid ? 'is-invalid' : '']"
                >
                  <option value="1">
                    {{ displayLang.CREATE_SHORTURL_TESTER }}
                  </option>
                  <option value="2">
                    {{ displayLang.CREATE_SHORTURL_MONITOR_GROUP_MANAGER }}
                  </option>
                </select>
                <template v-if="dirty && invalid">
                  <div class="invalid-feedback">'ログイン種別は変更できません。'</div>
                </template>
              </ValidationProvider>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-4">
              <label for="lang">{{ displayLang.CREATE_SHORTURL_LANG }}</label>
              <select class="form-control" v-model="lang" id="lang">
                <option value="ja">
                  {{ displayLang.CREATE_SHORTURL_JAPANESE }}
                </option>
                <option value="en">{{ displayLang.CREATE_SHORTURL_ENGLISH }}</option>
                <option value="cn">{{ displayLang.CREATE_SHORTURL_CHINESE }}</option>
              </select>
            </div>
            <div class="form-group col-4">
              <label for="is_mobile">{{ displayLang.CREATE_SHORTURL_IS_MOBILE }}</label>
              <select class="form-control" v-model="is_mobile" id="is_mobile">
                <option value="0">{{ displayLang.WORD_NOT_EXISTS }}</option>
                <option value="1">{{ displayLang.WORD_EXISTS }}</option>
              </select>
            </div>
            <div class="form-group col-4">
              <label for="is_mc_startup">{{
                displayLang.CREATE_SHORTURL_IS_MC_STARTUP
              }}</label>
              <select class="form-control" v-model="is_mc_startup" id="is_mc_startup">
                <option value="1">{{ displayLang.WORD_USE }}</option>
                <option value="0">{{ displayLang.WORD_NOT_USE }}</option>
              </select>
            </div>
          </div>
          <div class="form-row">
          <div class="form-group col-4">
              <label for="is_proctor">{{ displayLang.CREATE_SHORTURL_IS_PROCTOR }}</label>
              <select class="form-control" v-model="is_proctor" id="is_proctor">
                <option value="0">{{ displayLang.WORD_NOT_EXISTS }}</option>
                <option value="1">{{ displayLang.WORD_EXISTS }}</option>
              </select>
            </div>
            <div class="form-group col-4">
              <label for="is_auth">{{ displayLang.CREATE_SHORTURL_IS_AUTH }}</label>
              <select class="form-control" v-model="is_auth" id="is_auth">
                <option value="0">{{ displayLang.WORD_NOT_EXISTS }}</option>
                <option value="1">{{ displayLang.WORD_EXISTS }}</option>
              </select>
            </div>
          </div>
          <div class="bg-light p-3 mb-3">
            <div class="form-row">
              <div class="form-group col-8">
                <ValidationProvider
                  ref="exam_url"
                  v-slot="{ dirty, invalid, errors }"
                  rules="url|max:500"
                  slim
                >
                  <label for="exam_url">{{ displayLang.CREATE_SHORTURL_EXAM_URL }}</label>
                  <input
                    type="text"
                    class="form-control"
                    id="exam_url"
                    :name="displayLang.CREATE_SHORTURL_EXAM_URL"
                    v-model="exam_url"
                    :class="[dirty && invalid ? 'is-invalid' : '']"
                    :placeholder="displayLang.CREATE_SHORTURL_EXAM_URL_PLACEHOLDER"
                    :disabled="is_mc_startup == 1"
                  />
                  <template v-if="dirty && invalid">
                    <div class="invalid-feedback">
                      {{ errors[0] }}
                    </div>
                  </template>
                </ValidationProvider>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-4">
                <ValidationProvider
                  ref="region"
                  v-slot="{ dirty, invalid }"
                  rules="max:100"
                  slim
                >
                  <label for="region">{{ displayLang.CREATE_SHORTURL_REGION }}</label>
                  <input
                    type="text"
                    class="form-control"
                    id="region"
                    v-model="region"
                    :class="[dirty && invalid ? 'is-invalid' : '']"
                    :placeholder="displayLang.CREATE_SHORTURL_REGION"
                    :disabled="is_mc_startup == 1"
                  />
                  <template v-if="dirty && invalid">
                    <div class="invalid-feedback">
                      会場名は100文字以内でなければなりません。
                    </div>
                  </template>
                </ValidationProvider>
              </div>
              <div class="form-group col-4">
                <ValidationProvider
                  ref="exam_name"
                  v-slot="{ dirty, invalid }"
                  rules="max:100"
                  slim
                >
                  <label for="exam_name">{{
                    displayLang.CREATE_SHORTURL_TEST_NAME
                  }}</label>
                  <input
                    type="text"
                    class="form-control"
                    id="exam_name"
                    v-model="exam_name"
                    :class="[dirty && invalid ? 'is-invalid' : '']"
                    :placeholder="displayLang.CREATE_SHORTURL_TEST_NAME"
                    :disabled="is_mc_startup == 1"
                  />
                  <template v-if="dirty && invalid">
                    <div class="invalid-feedback">
                      試験名は100文字以内でなければなりません。
                    </div>
                  </template>
                </ValidationProvider>
              </div>
              <div class="form-group col-4">
                <label for="exam_datetime">{{
                  displayLang.CREATE_SHORTURL_TEST_DATETIME
                }}</label>
                <ValidationProvider
                  ref="exam_datetime"
                  v-slot="{ dirty, invalid }"
                  rules="max:100"
                  slim
                >
                  <input
                    type="text"
                    class="form-control"
                    id="exam_datetime"
                    v-model="exam_datetime"
                    :class="[dirty && invalid ? 'is-invalid' : '']"
                    :placeholder="displayLang.CREATE_SHORTURL_TEST_DATETIME"
                    :disabled="is_mc_startup == 1"
                  />
                  <template v-if="dirty && invalid">
                    <div class="invalid-feedback">
                      試験日時は100文字以内でなければなりません。
                    </div>
                  </template>
                </ValidationProvider>
              </div>
              <div class="form-text text-muted mt-3">
                {{ displayLang.CREATE_SHORTURL_MC_NOT_USE }}
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-4">
              <label for="is_voice_recording">{{
                displayLang.CREATE_SHORTURL_IS_VOICE_RECORDING
              }}</label>
              <select
                class="form-control"
                v-model="is_voice_recording"
                id="is_voice_recording"
              >
                <option value="0">{{ displayLang.WORD_NOT_EXISTS }}</option>
                <option value="1">{{ displayLang.WORD_EXISTS }}</option>
              </select>
            </div>
            <div class="form-group col-4">
              <label for="is_record">{{ displayLang.CREATE_SHORTURL_IS_RECORD }}</label>

              <select class="form-control" v-model="is_record" id="is_record">
                <option value="0">{{ displayLang.WORD_NOT_USE }}</option>
                <option value="1">{{ displayLang.WORD_USE }}</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-4">
              <label for="is_summary">{{ displayLang.CREATE_SHORTURL_IS_SUMMARY }}</label>
              <select class="form-control" v-model="is_summary" id="is_summary">
                <option value="0">{{ displayLang.WORD_NOT_USE }}</option>
                <option value="1">{{ displayLang.WORD_USE }}</option>
              </select>
            </div>
            <div class="form-group col-4">
              <ValidationProvider
                ref="max_rectime"
                v-slot="{ dirty, invalid }"
                rules="numeric"
                slim
              >
                <label for="max_rectime">{{
                  displayLang.CREATE_SHORTURL_MAXIMAM_RECORDING_TIME
                }}</label>
                <input
                  type="number"
                  value="7200"
                  v-model="max_rectime"
                  class="form-control"
                  :class="[dirty && invalid ? 'is-invalid' : '']"
                  id="max_rectime"
                />
                <template v-if="dirty && invalid">
                  <div class="invalid-feedback">数値で入力してください。</div>
                </template>
              </ValidationProvider>
              <div class="form-text text-muted mt-1">
                {{ displayLang.CREATE_SHORTURL_NUM_ONLY }}
              </div>
            </div>
            <div class="form-group col-4">
              <ValidationProvider
                ref="matching_timeout"
                v-slot="{ dirty, invalid }"
                rules="numeric"
                slim
              >
                <label for="matching_timeout">{{
                  displayLang.CREATE_SHORTURL_MATCHING_TIMEOUT
                }}</label>
                <input
                  type="text"
                  value="5"
                  v-model="matching_timeout"
                  class="form-control"
                  :class="[dirty && invalid ? 'is-invalid' : '']"
                  id="matching_timeout"
                />
                <template v-if="dirty && invalid">
                  <div class="invalid-feedback">数値で入力してください。</div>
                </template>
              </ValidationProvider>
              <div class="form-text text-muted mt-1">
                {{ displayLang.CREATE_SHORTURL_NUM_ONLY }}
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-4">
              <ValidationProvider
                ref="tester_retry"
                v-slot="{ dirty, invalid }"
                rules="numeric"
                slim
              >
                <label for="tester_retry">{{
                  displayLang.CREATE_SHORTURL_TESTER_RETRY
                }}</label>
                <input
                  type="number"
                  value="100"
                  v-model="tester_retry"
                  class="form-control"
                  :class="[dirty && invalid ? 'is-invalid' : '']"
                  id="tester_retry"
                />
                <template v-if="dirty && invalid">
                  <div class="invalid-feedback">数値で入力してください。</div>
                </template>
              </ValidationProvider>
              <div class="form-text text-muted mt-1">
                {{ displayLang.CREATE_SHORTURL_NUM_ONLY }}
              </div>
            </div>
            <div class="form-group col-4">
              <label for="checker_retry">{{
                displayLang.CREATE_SHORTURL_CHECKER_RETRY
              }}</label>
              <ValidationProvider
                ref="checker_retry"
                v-slot="{ dirty, invalid }"
                rules="numeric"
                slim
              >
                <input
                  type="number"
                  value="100"
                  v-model="checker_retry"
                  class="form-control"
                  :class="[dirty && invalid ? 'is-invalid' : '']"
                  id="checker_retry"
                />
                <template v-if="dirty && invalid">
                  <div class="invalid-feedback">数値で入力してください。</div>
                </template>
              </ValidationProvider>
              <div class="form-text text-muted mt-1">
                {{ displayLang.CREATE_SHORTURL_NUM_ONLY }}
              </div>
            </div>
            <div class="form-group col-4">
              <ValidationProvider
                ref="webrtc_timeout"
                v-slot="{ dirty, invalid }"
                rules="numeric"
                slim
              >
                <label for="webrtc_timeout">{{
                  displayLang.CREATE_SHORTURL_WEBRTC_TIMEOUT
                }}</label>
                <input
                  type="number"
                  value="30"
                  v-model="webrtc_timeout"
                  class="form-control"
                  :class="[dirty && invalid ? 'is-invalid' : '']"
                  id="webrtc_timeout"
                />
                <template v-if="dirty && invalid">
                  <div class="invalid-feedback">数値で入力してください。</div>
                </template>
              </ValidationProvider>
              <div class="form-text text-muted mt-1">
                {{ displayLang.CREATE_SHORTURL_NUM_ONLY }}
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-4">
              <ValidationProvider
                ref="intervaltime"
                v-slot="{ dirty, invalid }"
                rules="numeric"
                slim
              >
                <label for="intervaltime">{{
                  displayLang.CREATE_SHORTURL_INTERVALTIME
                }}</label>
                <input
                  type="number"
                  value="20"
                  v-model="intervaltime"
                  class="form-control"
                  :class="[dirty && invalid ? 'is-invalid' : '']"
                  id="intervaltime"
                />
                <template v-if="dirty && invalid">
                  <div class="invalid-feedback">数値で入力してください。</div>
                </template>
              </ValidationProvider>
              <div class="form-text text-muted mt-1">
                {{ displayLang.CREATE_SHORTURL_NUM_ONLY }}
              </div>
            </div>
            <div class="form-group col-4">
              <label for="webrtc_max_time">{{
                displayLang.CREATE_SHORTURL_WEBRTC_MAX_TIME
              }}</label>
              <input
                type="number"
                value="7200"
                v-model="webrtc_max_time"
                class="form-control"
                id="webrtc_max_time"
              />
              <div class="form-text text-muted mt-1">
                {{ displayLang.CREATE_SHORTURL_NUM_ONLY }}
              </div>
            </div>
            <div class="form-group col-4">
              <label for="is_debug">{{ displayLang.CREATE_SHORTURL_DEBUG_OPTION }}</label>
              <select class="form-control" v-model="is_debug" id="is_debug">
                <option value="0">{{ displayLang.CREATE_SHORTURL_OFF }}</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-4">
              <label for="is_conv">{{ displayLang.CREATE_SHORTURL_IS_CONV }}</label>
              <select class="form-control" v-model="is_conv" id="is_conv">
                <option value="0">{{ displayLang.WORD_DONT_DO }}</option>
                <option value="1">{{ displayLang.WORD_DO }}</option>
              </select>
            </div>
            <div class="form-group col-4">
              <label for="video_recording_preference">{{
                displayLang.CREATE_SHORTURL_VIDEO_RECORDING_PREFERENCE
              }}</label>
              <select
                class="form-control"
                v-model="video_recording_preference"
                id="video_recording_preference"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
              </select>
            </div>
            <div class="form-group col-4">
              <label for="voice_quality_preference">{{
                displayLang.CREATE_SHORTURL_VOICE_QUALITY_PREFERENCE
              }}</label>
              <select
                class="form-control"
                v-model="voice_quality_preference"
                id="voice_quality_preference"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-4">
              <ValidationProvider
                ref="ai_after_analysis"
                v-slot="{ dirty, invalid }"
                rules="required"
                slim
              >
                <label for="ai_after_analysis">{{
                  displayLang.CREATE_SHORTURL_ANALYSIS_TYPE
                }}</label>
                <div>
                  <div class="custom-control custom-checkbox custom-control-inline">
                    <input
                      name="ai_eye"
                      id="ai_eye"
                      type="checkbox"
                      value="1"
                      v-model="ai_after_analysis"
                      class="custom-control-input"
                    />
                    <label class="custom-control-label" for="ai_eye">{{
                      displayLang.CREATE_SHORTURL_EYE_ROT
                    }}</label>
                  </div>
                  <div class="custom-control custom-checkbox custom-control-inline">
                    <input
                      name="ai_other"
                      id="ai_other"
                      type="checkbox"
                      value="2"
                      v-model="ai_after_analysis"
                      class="custom-control-input"
                    />
                    <label class="custom-control-label" for="ai_other">{{
                      displayLang.CREATE_SHORTURL_OTHER_PERSON
                    }}</label>
                  </div>
                  <div class="custom-control custom-checkbox custom-control-inline">
                    <input
                      name="ai_num"
                      id="ai_num"
                      type="checkbox"
                      value="3"
                      v-model="ai_after_analysis"
                      class="custom-control-input"
                    />
                    <label class="custom-control-label" for="ai_num">{{
                      displayLang.CREATE_SHORTURL_PEOPLE_NUM
                    }}</label>
                  </div>
                  <div class="custom-control custom-checkbox custom-control-inline">
                    <input
                      name="ai_voice"
                      id="ai_voice"
                      type="checkbox"
                      value="4"
                      v-model="ai_after_analysis"
                      class="custom-control-input"
                    />
                    <label class="custom-control-label" for="ai_voice">{{
                      displayLang.CREATE_SHORTURL_VOICE
                    }}</label>
                  </div>
                </div>
                <template v-if="dirty && invalid">
                  <div class="invalid-feedback">いずれか一つ選択してください。</div>
                </template>
              </ValidationProvider>
            </div>
            <div class="form-group col-4">
              <ValidationProvider
                ref="is_forget_password"
                v-slot="{ dirty, invalid }"
                rules="max:500"
                slim
              >
                <label for="is_forget_password">{{
                  displayLang.CREATE_SHORTURL_FORGET_PASSWORD
                }}</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="is_forget_password"
                  :class="[dirty && invalid ? 'is-invalid' : '']"
                  id="is_forget_password"
                />
                <template v-if="dirty && invalid">
                  <div class="invalid-feedback">500文字以内で入力してください。</div>
                </template>
              </ValidationProvider>
              <div class="form-text text-muted mt-1">
                {{ displayLang.CREATE_SHORTURL_OPTION }}
              </div>
            </div>
            <div class="form-group col-4">
              <ValidationProvider
                ref="memo"
                v-slot="{ dirty, invalid }"
                rules="max:30"
                slim
              >
                <label for="memo">{{ displayLang.CREATE_SHORTURL_MEMO }}</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="memo"
                  id="memo"
                  :class="[dirty && invalid ? 'is-invalid' : '']"
                />
                <template v-if="dirty && invalid">
                  <div class="invalid-feedback">30文字以内で入力してください。</div>
                </template>
              </ValidationProvider>
              <div class="form-text text-muted mt-1">
                {{ displayLang.CREATE_SHORTURL_OPTION_30 }}
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-4">
              <label for="mode">{{ displayLang.CREATE_SHORTURL_MODE }}</label>
              <select
              class="form-control"
              :disabled="actor != 2"
              v-model="mode"
              id="mode"
              >
                <option value="0">0</option>
                <option value="1">1</option>
              </select>
              <div class="form-text text-muted mt-1">
                {{ displayLang.CREATE_SHORTURL_MODE_WORD }}
              </div>
            </div>
            <div class="form-group col-4">
              <label for="is_ai_auth">{{ displayLang.CREATE_SHORTURL_AI_AUTH }}</label>
              <select class="form-control" v-model="is_ai_auth" id="is_ai_auth">
                <option value="1">{{ displayLang.CREATE_SHORTURL_MONITOR }}</option>
                <option value="2">{{ displayLang.CREATE_SHORTURL_AI }}</option>
              </select>
            </div>
          </div>
          <div class="bg-light p-3 mb-3">
            <div class="form-row">
              <div class="form-group col-4">
                <label for="is_ai_faild_manual">{{
                  displayLang.CREATE_SHORTURL_AI_FAILED_MANUAL
                }}</label>
                <select
                  class="form-control"
                  v-model="is_ai_faild_manual"
                  id="is_ai_faild_manual"
                >
                  <option value="1">
                    {{ displayLang.CREATE_SHORTURL_AI_FORCED_LOGOUT }}
                  </option>
                  <option value="2">
                    {{ displayLang.CREATE_SHORTURL_PROCTOR_AUTH }}
                  </option>
                  <option value="3">{{ displayLang.WORD_CONTINUE }}</option>
                </select>
              </div>
              <div class="form-group col-4">
                <label for="is_ai_idcard_request">{{
                  displayLang.CREATE_SHORTURL_COLLECT_ID_IMAGE
                }}</label>
                <select
                  class="form-control"
                  v-model="is_ai_idcard_request"
                  id="is_ai_idcard_request"
                >
                  <option value="1">{{ displayLang.WORD_DO }}</option>
                  <option value="0">{{ displayLang.WORD_DONT_DO }}</option>
                </select>
              </div>
              <div class="form-group col-4">
                <ValidationProvider
                  ref="ai_face_retry"
                  v-slot="{ dirty, invalid }"
                  rules="numeric"
                  slim
                >
                  <label for="ai_face_retry">{{
                    displayLang.CREATE_SHORTURL_FACE_RETRIE_TIME
                  }}</label>
                  <input
                    type="number"
                    value="3"
                    v-model="ai_face_retry"
                    class="form-control"
                    :class="[dirty && invalid ? 'is-invalid' : '']"
                    id="ai_face_retry"
                  />
                  <template v-if="dirty && invalid">
                    <div class="invalid-feedback">数値で入力してください。</div>
                  </template>
                </ValidationProvider>
                <div class="form-text text-muted mt-1">
                  {{ displayLang.CREATE_SHORTURL_NUM_ONLY }}
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-4">
                <ValidationProvider
                  ref="ai_idcard_retry"
                  v-slot="{ dirty, invalid }"
                  rules="numeric"
                  slim
                >
                  <label for="ai_idcard_retry">{{
                    displayLang.CREATE_SHORTURL_ID_RETRIE_TIME
                  }}</label>
                  <input
                    type="number"
                    value="3"
                    class="form-control"
                    v-model="ai_idcard_retry"
                    :class="[dirty && invalid ? 'is-invalid' : '']"
                    id="ai_idcard_retry"
                  />
                  <template v-if="dirty && invalid">
                    <div class="invalid-feedback">数値で入力してください。</div>
                  </template>
                </ValidationProvider>
                <div class="form-text text-muted mt-1">
                  {{ displayLang.CREATE_SHORTURL_NUM_ONLY }}
                </div>
              </div>
              <div class="form-group col-4">
                <ValidationProvider
                  ref="ai_all_retry"
                  v-slot="{ dirty, invalid }"
                  rules="numeric"
                  slim
                >
                  <label for="ai_all_retry">{{
                    displayLang.CREATE_SHORTURL_ALL_RETRIE_TIME
                  }}</label>
                  <input
                    type="number"
                    value="3"
                    v-model="ai_all_retry"
                    class="form-control"
                    :class="[dirty && invalid ? 'is-invalid' : '']"
                    id="ai_all_retry"
                  />
                  <template v-if="dirty && invalid">
                    <div class="invalid-feedback">数値で入力してください。</div>
                  </template>
                </ValidationProvider>
                <div class="form-text text-muted mt-1">
                  {{ displayLang.CREATE_SHORTURL_NUM_ONLY }}
                </div>
              </div>
              <div class="form-group col-4">
                <ValidationProvider
                  ref="ai_namematch"
                  v-slot="{ dirty, invalid }"
                  rules="min_value:1|max_value:100"
                  slim
                >
                  <label for="ai_namematch">{{
                    displayLang.CREATE_SHORTURL_NAME_MATCHING_TOLERANCE
                  }}</label>
                  <input
                    type="number"
                    value="75"
                    v-model="ai_namematch"
                    class="form-control"
                    :class="[dirty && invalid ? 'is-invalid' : '']"
                    id="ai_namematch"
                  />
                  <template v-if="dirty && invalid">
                    <div class="invalid-feedback">
                      1から100までの数値で入力してください。
                    </div>
                  </template>
                </ValidationProvider>
                <div class="form-text text-muted mt-1">
                  {{ displayLang.CREATE_SHORTURL_NUM_ONLY_1_TO_100 }}
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-8">
                <ValidationProvider
                  ref="ai_idcard_type"
                  v-slot="{ dirty, invalid }"
                  rules="required"
                  slim
                >
                  <label for="ai_idcard_type">{{
                    displayLang.CREATE_SHORTURL_PUBLIC_CERTIFICATION
                  }}</label>
                  <div>
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input
                        name="lc_dr"
                        id="lc_dr"
                        type="checkbox"
                        value="1"
                        v-model="ai_idcard_type"
                        class="custom-control-input"
                      />
                      <label class="custom-control-label" for="lc_dr">{{
                        displayLang.WORD_DRIVERS_LICENSE
                      }}</label>
                    </div>
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input
                        name="lc_pp"
                        id="lc_pp"
                        type="checkbox"
                        value="2"
                        v-model="ai_idcard_type"
                        class="custom-control-input"
                      />
                      <label class="custom-control-label" for="lc_pp">{{
                        displayLang.WORD_PASSPORT
                      }}</label>
                    </div>
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input
                        name="lc_mc"
                        id="lc_mc"
                        type="checkbox"
                        value="3"
                        v-model="ai_idcard_type"
                        class="custom-control-input"
                      />
                      <label class="custom-control-label" for="lc_mc">{{
                        displayLang.WORD_MY_NUMBER_CARD
                      }}</label>
                    </div>
                  </div>
                  <template v-if="dirty && invalid">
                    <div class="invalid-feedback">いずれか一つ選択してください。</div>
                  </template>
                </ValidationProvider>
                <div class="form-text text-muted mt-1">
                  {{ displayLang.CREATE_SHORTURL_REQUIRED }}
                </div>
              </div>
            </div>
          </div>
          <div class="bg-light p-3 mb-3">
            <div class="form-row">
              <div class="form-group col-4">
                <ValidationProvider
                  ref="capture"
                  v-slot="{ dirty, invalid }"
                  rules="min_value:0|max_value:3600"
                  slim
                >
                  <label for="capture">{{
                    displayLang.CREATE_SHORTURL_CAPTURE_INTERVAL
                  }}</label>
                  <input
                    type="number"
                    value="2"
                    v-model="capture"
                    :class="[dirty && invalid ? 'is-invalid' : '']"
                    class="form-control"
                    id="capture"
                  />
                  <template v-if="dirty && invalid">
                    <div class="invalid-feedback">
                      0から3600までの数値で入力してください。
                    </div>
                  </template>
                </ValidationProvider>
                <div class="form-text text-muted mt-1">
                  {{ displayLang.CREATE_SHORTURL_NUM_ONLY_0_TO_3600 }}
                </div>
              </div>
              <div class="form-group col-4">
                <label for="capturecheck">{{
                  displayLang.CREATE_SHORTURL_CAPTURE_ANALYSIS_TYPE
                }}</label>
                <select class="form-control" v-model="capturecheck" id="capturecheck">
                  <option value="0">
                    {{ displayLang.CREATE_SHORTURL_NO_AI_CHECK }}
                  </option>
                  <option value="1">
                    {{ displayLang.CREATE_SHORTURL_AI_REALTIME_CHECK }}
                  </option>
                  <option value="2">
                    {{ displayLang.CREATE_SHORTURL_AI_AFTER_CHECK }}
                  </option>
                </select>
              </div>
              <div class="form-group col-4">
                <label for="capturedisplay">{{
                  displayLang.CREATE_SHORTURL_CAPTURE_IMAGE_DISPLAY
                }}</label>
                <select class="form-control" v-model="capturedisplay" id="capturedisplay">
                  <option value="0">
                    {{ displayLang.CREATE_SHORTURL_DO_NOT_SHOW }}
                  </option>
                  <option value="1">
                    {{ displayLang.CREATE_SHORTURL_DO_SHOW }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer text-center">
          <button type="button" class="btn btn-sm btn-primary" @click="onClickRegister()">
            {{
              value !== undefined
                ? displayLang.CREATE_SHORTURL_LIST_CHANGE_BUTTON_LABEL
                : displayLang.CREATE_SHORTURL_REGISTER
            }}
          </button>
        </div>
      </div>

      <BackButton
        :label="displayLang.MANAGEMETN_LINK_BACK"
        @click="$router.replace('/create-shorturl-list')"
      />
    </div>
  </ValidationObserver>
</template>

<script lang="ts">
import Vue from "vue";
import { LanguageEnum } from "~/store/enum/language";
import * as rootTypes from "@/store/types/rootType";
import * as commonTypes from "~/store/types/commonType";
import * as createShortUrlPageTypes from "@/store/types/createShortUrlPageType";
import BackButton from "@/components/Common/Buttons/BackButton.vue";
import {
  CreateShortUrlInsertRequestType,
  ShortUrl,
} from "@/store/types/adapters/createShortUrlAdapter";

export default Vue.extend({
  name: "CreateShorturl",
  components: {
    BackButton,
  },
  props: {
    value: {
      default: undefined,
    },
  },
  created() {
    if (this.value !== undefined) {
      // @ts-ignore
      this.formData = this.value;
    }
  },
  data() {
    return {
      // 既定の初期値
      formData: {
        actor: 1,
        target: "https://FQDN",
        url_key: "",
        param: {
          lang: "ja",
          is_mobile: 0,
          is_mc_startup: 1,
          is_proctor: 0,
          is_auth: 1,
          exam_url: "",
          region: "",
          exam_name: "",
          exam_datetime: "",
          is_voice_recording: 1,
          is_record: 1,
          is_summary: 1,
          max_rectime: 7200,
          matching_timeout: 5,
          tester_retry: 100,
          checker_retry: 100,
          webrtc_timeout: 30,
          intervaltime: 20,
          webrtc_max_time: 7200,
          is_debug: 0,
          is_conv: 1,
          video_recording_preference: 15,
          voice_quality_preference: 6,
          ai_after_analysis: [] as number[],
          is_forget_password: "",
          memo: "",
          mode: 0 as number | '' as string,
          is_ai_auth: 2,
          is_ai_faild_manual: 1,
          is_ai_idcard_request: 1,
          ai_face_retry: 3,
          ai_idcard_retry: 3,
          ai_all_retry: 3,
          ai_namematch: 75,
          ai_idcard_type: [] as number[],
          capture: 2,
          capturecheck: 1,
          capturedisplay: 1,
        },
      },
    };
  },
  watch: {
    "formData.actor"(v) {
      if (v == 1) {
        this.formData.param.mode = '';
      } else {
        // @ts-ignore
        this.formData.param.mode = 0;
      }
    }
  },
  mounted() {
    if (this.formData.actor == 1) {
      this.formData.param.mode = '';
    }
  },
  computed: {
    displayLang(): LanguageEnum {
      return this.$store.getters[rootTypes.GETTER_DISPLAY_LANG];
    },
    actor: {
      get(): number {
        return this.formData.actor;
      },
      set(value: number) {
        this.formData.actor = value;
      },
    },
    target: {
      get(): string {
        return this.formData.target;
      },
      set(value: string) {
        this.formData.target = value;
      },
    },
    url_key: {
      get(): string {
        return this.formData.url_key;
      },
      set(value: string) {
        this.formData.url_key = value;
      },
    },
    lang: {
      get(): string {
        return this.formData.param.lang;
      },
      set(value: string) {
        this.formData.param.lang = value;
      },
    },
    is_mobile: {
      get(): number {
        return this.formData.param.is_mobile;
      },
      set(value: number) {
        this.formData.param.is_mobile = value;
      },
    },
    is_mc_startup: {
      get(): number {
        return this.formData.param.is_mc_startup;
      },
      set(value: number) {
        this.formData.param.is_mc_startup = value;
      },
    },
    is_proctor: {
      get(): number {
        return this.formData.param.is_proctor;
      },
      set(value: number) {
        this.formData.param.is_proctor = value;
      },
    },
    is_auth: {
      get(): number {
        return this.formData.param.is_auth;
      },
      set(value: number) {
        this.formData.param.is_auth = value;
      },
    },
    exam_url: {
      get(): string {
        return this.formData.param.exam_url;
      },
      set(value: string) {
        this.formData.param.exam_url = value;
      },
    },
    region: {
      get(): string {
        return this.formData.param.region;
      },
      set(value: string) {
        this.formData.param.region = value;
      },
    },
    exam_name: {
      get(): string {
        return this.formData.param.exam_name;
      },
      set(value: string) {
        this.formData.param.exam_name = value;
      },
    },
    exam_datetime: {
      get(): string {
        return this.formData.param.exam_datetime;
      },
      set(value: string) {
        this.formData.param.exam_datetime = value;
      },
    },
    is_voice_recording: {
      get(): number {
        return this.formData.param.is_voice_recording;
      },
      set(value: number) {
        this.formData.param.is_voice_recording = value;
      },
    },
    is_record: {
      get(): number {
        return this.formData.param.is_record;
      },
      set(value: number) {
        this.formData.param.is_record = value;
      },
    },
    is_summary: {
      get(): number {
        return this.formData.param.is_summary;
      },
      set(value: number) {
        this.formData.param.is_summary = value;
      },
    },
    max_rectime: {
      get(): number {
        return this.formData.param.max_rectime;
      },
      set(value: number) {
        this.formData.param.max_rectime = value;
      },
    },
    matching_timeout: {
      get(): number {
        return this.formData.param.matching_timeout;
      },
      set(value: number) {
        this.formData.param.matching_timeout = value;
      },
    },
    tester_retry: {
      get(): number {
        return this.formData.param.tester_retry;
      },
      set(value: number) {
        this.formData.param.tester_retry = value;
      },
    },
    checker_retry: {
      get(): number {
        return this.formData.param.checker_retry;
      },
      set(value: number) {
        this.formData.param.checker_retry = value;
      },
    },
    webrtc_timeout: {
      get(): number {
        return this.formData.param.webrtc_timeout;
      },
      set(value: number) {
        this.formData.param.webrtc_timeout = value;
      },
    },
    intervaltime: {
      get(): number {
        return this.formData.param.intervaltime;
      },
      set(value: number) {
        this.formData.param.intervaltime = value;
      },
    },
    webrtc_max_time: {
      get(): number {
        return this.formData.param.webrtc_max_time;
      },
      set(value: number) {
        this.formData.param.webrtc_max_time = value;
      },
    },
    is_debug: {
      get(): number {
        return this.formData.param.is_debug;
      },
      set(value: number) {
        this.formData.param.is_debug = value;
      },
    },
    is_conv: {
      get(): number {
        return this.formData.param.is_conv;
      },
      set(value: number) {
        this.formData.param.is_conv = value;
      },
    },
    video_recording_preference: {
      get(): number {
        return this.formData.param.video_recording_preference;
      },
      set(value: number) {
        this.formData.param.video_recording_preference = value;
      },
    },
    voice_quality_preference: {
      get(): number {
        return this.formData.param.voice_quality_preference;
      },
      set(value: number) {
        this.formData.param.voice_quality_preference = value;
      },
    },
    ai_after_analysis: {
      get(): number[] {
        return this.formData.param.ai_after_analysis;
      },
      set(value: number[]) {
        this.formData.param.ai_after_analysis = value;
      },
    },
    is_forget_password: {
      get(): string {
        return this.formData.param.is_forget_password;
      },
      set(value: string) {
        this.formData.param.is_forget_password = value;
      },
    },
    memo: {
      get(): string {
        return this.formData.param.memo;
      },
      set(value: string) {
        this.formData.param.memo = value;
      },
    },
    mode: {
      get(): (number | string) {
        return this.formData.param.mode;
      },
      set(value: any) {
          this.formData.param.mode = value;
      },
    },
    is_ai_auth: {
      get(): number {
        return this.formData.param.is_ai_auth;
      },
      set(value: number) {
        this.formData.param.is_ai_auth = value;
      },
    },
    is_ai_faild_manual: {
      get(): number {
        return this.formData.param.is_ai_faild_manual;
      },
      set(value: number) {
        this.formData.param.is_ai_faild_manual = value;
      },
    },
    is_ai_idcard_request: {
      get(): number {
        return this.formData.param.is_ai_idcard_request;
      },
      set(value: number) {
        this.formData.param.is_ai_idcard_request = value;
      },
    },
    ai_face_retry: {
      get(): number {
        return this.formData.param.ai_face_retry;
      },
      set(value: number) {
        this.formData.param.ai_face_retry = value;
      },
    },
    ai_idcard_retry: {
      get(): number {
        return this.formData.param.ai_idcard_retry;
      },
      set(value: number) {
        this.formData.param.ai_idcard_retry = value;
      },
    },
    ai_all_retry: {
      get(): number {
        return this.formData.param.ai_all_retry;
      },
      set(value: number) {
        this.formData.param.ai_all_retry = value;
      },
    },
    ai_namematch: {
      get(): number {
        return this.formData.param.ai_namematch;
      },
      set(value: number) {
        this.formData.param.ai_namematch = value;
      },
    },
    ai_idcard_type: {
      get(): number[] {
        return this.formData.param.ai_idcard_type;
      },
      set(value: number[]) {
        this.formData.param.ai_idcard_type = value;
      },
    },
    capture: {
      get(): number {
        return this.formData.param.capture;
      },
      set(value: number) {
        this.formData.param.capture = value;
      },
    },
    capturecheck: {
      get(): number {
        return this.formData.param.capturecheck;
      },
      set(value: number) {
        this.formData.param.capturecheck = value;
      },
    },
    capturedisplay: {
      get(): number {
        return this.formData.param.capturedisplay;
      },
      set(value: number) {
        this.formData.param.capturedisplay = value;
      },
    },
  },
  methods: {
    /**
     * フォームのバリデーションを行います。
     */
    formValidate(): Promise<boolean> {
      // フォームの要素をdirty状態に変更します。
      // dirty状態(そのinputに一度以上入力があった状態)に変更しないと、validation()のメッセージが表示されないため。
      [
        "actorInput",
        "exam_url",
        "region",
        "exam_name",
        "exam_datetime",
        "max_rectime",
        "matching_timeout",
        "tester_retry",
        "checker_retry",
        "webrtc_timeout",
        "intervaltime",
        "ai_after_analysis",
        "is_forget_password",
        "memo",
        "ai_face_retry",
        "ai_idcard_retry",
        "ai_all_retry",
        "ai_namematch",
        "ai_idcard_type",
        "capture",
      ].forEach((ref) => {
        const flags = {
          dirty: true,
          pristine: false,
        };

        (this.$refs[ref] as any).setFlags(flags);
      });
      return (this.$refs.createShortUrlForm as any).validate(false);
    },
    /**
     * [登録]＆[更新]ボタン押下時のイベントハンドラ
     */
    onClickRegister() {
      // @ts-ignore
      this.formValidate().then((valid: boolean) => {
        if (!valid) {
          this.$modals.showErrorAlert("入力に不備があります。");
          return;
        }

        const param = JSON.stringify(this.formData.param);
        this.$delete(this.formData, "param");
        this.formData = Object.assign({}, this.formData, { param });

        // 親コンポーネントからvalueが渡されていればupdate
        if (this.value !== undefined) {
          this.$modals
            .showSuccessConfirm("変更処理を続行して宜しいですか？", { title: "変更確認" })
            .then((ok: boolean) => {
              // [OK]ボタン以外は処理を行わない
              if (!ok) {
                return;
              }

              this.$store
                .dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
                .then(() => {
                  return new Promise((resolve, reject) => {
                    this.$store
                      .dispatch(
                        createShortUrlPageTypes.ACTION_UPDATE_SHORTEN_URL_POST,
                        this.formData
                      )
                      .catch(() => {
                        // エラーモーダル表示
                        this.$modals.showErrorAlert("変更処理に失敗しました。");

                        reject();
                      })
                      .finally(() => {
                        this.$router.replace("/create-shorturl-list");
                        this.$store.dispatch(
                          commonTypes.ACTION_COMMON_SET_LOADING,
                          false
                        );
                      });
                  });
                });
            });
        } else {
          this.$modals
            .showSuccessConfirm("登録処理を続行して宜しいですか？", { title: "登録確認" })
            .then((ok: boolean) => {
              // [OK]ボタン以外は処理を行わない
              if (!ok) {
                return;
              }

              this.$store
                .dispatch(commonTypes.ACTION_COMMON_SET_LOADING, true)
                .then(() => {
                  return new Promise((resolve, reject) => {
                    this.$store
                      .dispatch(
                        createShortUrlPageTypes.ACTION_INSERT_SHORTEN_URL_POST,
                        this.formData
                      )
                      .catch(() => {
                        // エラーモーダル表示
                        this.$modals.showErrorAlert("登録処理に失敗しました。");

                        reject();
                      })
                      .finally(() => {
                        this.$router.replace("/create-shorturl-list");
                        this.$store.dispatch(
                          commonTypes.ACTION_COMMON_SET_LOADING,
                          false
                        );
                      });
                  });
                });
            });
        }
      });
    },
  },
});
</script>

<style></style>
