<template>
  <div>
    <back-button>
    </back-button>
    <div class="order-header">
      <span class="order-header">确认预约</span>
    </div>
    <div class="order-body">
      <p>课程名称：
        <span>{{title}}</span>
      </p>
      <hr/>
      <p>
        课程数量：
        <span>{{sessions+'节'}}</span>
      </p>
      <hr/>
      <p>
        每课时长：
        <span>{{session_hours+'小时'}}</span>
      </p>
      <!--<hr/>-->
      <!--<p>-->
      <!--开课日期：-->
      <!--<span>{{startTime}}</span>-->
      <!--</p>-->
      <!--<hr/>-->
      <!--<p>-->
      <!--结课日期：-->
      <!--<span>{{endTime}}</span>-->
      <!--</p>-->
      <hr v-if="note"/>
      <p v-if="note">
        课程备注：
        <span>{{note}}</span>
      </p>
    </div>
    <div class="order-body">
      <el-form status-icon label-position="left"
               label-width="22%"
               class="demo-ruleForm">
        <!--<el-form-item label="支付方式">-->
        <!--<el-select v-model="method" placeholder="请选择支付方式">-->
        <!--<el-option label="支付宝" value="weixin">-->
        <!--</el-option>-->
        <!--<el-option label="微信" value="zhifubao">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <p>本系统暂时只支持支付宝的支付方式</p>
        <el-form-item label="选择学期">
          <el-select v-model="time_span_id" placeholder="请选择学期">
            <el-option v-for="item in time_spans" :key="item.id" :label="item.start_time+'--'+item.end_time"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="填写备注（选填）">
          <textarea v-model="student_notes" style="width:90%;position:relative;top:15px;">
          </textarea>
        </el-form-item>
      </el-form>
    </div>
    <div class="order-word">
      <p>
        用户须知：
      </p>
      <p v-html="hint">
      </p>
    </div>
    <div class="footer">
      <span>需支付订金</span>
      <span class="money">{{money.toString()+'元'}}</span>
      <a @click="submitForm()">确认提交</a>
    </div>
    <!--下面的这个区块是为了占位-->
    <div style="height: 110px;"></div>
  </div>
</template>

<script>
  import BackButton from './backButton';
  import userMessage from '../store/index';
  import axios from '../axios/index';

  export default {
    name: 'order',
    components: {
      BackButton
    },
    data () {
      return {
        method: '',
        title: userMessage.state.courseDetail.title,
        money: userMessage.state.courseDetail.deposit,
        note: userMessage.state.courseDetail.note,
        time_spans: userMessage.state.courseDetail.time_spans,
        session_hours: userMessage.state.courseDetail.session_hours,
        sessions: userMessage.state.courseDetail.sessions,
        hint: '1.课程预约订单自成功预约时起计算7日有效，或至课程开课前第7日，两者日期先到为准；其余特殊情况以教师/机构认定为准<br/>2.用户可随时取消课程预约<br/>3.如果用户不是具备完全民事权利能力和完全民事行为能力的自然人，请用户征得其监护人许可或由其监护人直接使用“青学教育信息”服务。后续线上线下上课、付款等所有相关事宜也必须由监护人陪同或征得监护人许可完成<br/>',
        student_notes: '',
        time_span_id: ''
      }
    },
    methods: {
      submitForm () {
        if (!this.time_span_id) {
          this.$message({
            message: '课程时间为必填项',
            type: 'error',
            duration: 2000
          });
        } else {
          axios({
            method: 'post',
            url: '/api/order/course_orders/',
            // headers: {
            //   'X-CSRFToken': document.cookie.match(/.*csrftoken=([^;.]*).*$/) === null ? null : document.cookie.match(/.*csrftoken=([^;.]*).*$/)[1]
            // },
            data: {
              course_id: userMessage.state.courseDetail.id,
              time_span_id: this.time_span_id,
              student_notes: this.student_notes
            }
          })
            .then(function (response) {
              if (response) {
                userMessage.commit('commitOrderResult', response);
                this.$router.push({path: '/order/result/'});
                window.location.href = response.payment_url;
              }
            }.bind(this))
            .catch(function (error) {
              console.log(error);
            })
        }
      }
    }
  }
</script>

<style scoped>
  div.order-header {
    width: 100%;
    height: 100%;
    line-height: 50px;
    text-align: center;

    background: linear-gradient(to right, #68eace, #4ca2ef);
  }

  .order-header {
    font-size: larger;
    color: #eee;
  }

  .footer {
    max-height: 40px;
    max-width: 450px;
    width: 100%;
    position: fixed;
    bottom: 8%;
    align-items: center;
    display: flex;
    justify-content: flex-end;

    background-color: white;
  }

  .footer a {
    flex: 0 1 25%;
    max-height: 40px;
    /*width:100%;*/
    /*height:30px;*/
    text-align: center;
    font-size: medium;
    color: white;
    background-color: #e62739;
    opacity: 0.9;
    padding: 2% 2%;
    border-left: 0;
    border-right: 0;
    border-radius: 5px;
  }

  .footer a:active {
    background-color: #F74D61;
  }

  span {
    font-size: larger;
  }

  span.money {
    color: #e62739;
    margin: 0 5% 0 0;
  }

  div.order-word {
    padding: 5%;
    margin: 5% 0;
    line-height: 2em;
    letter-spacing: 2px;
    font-size: medium;
    background-color: white;
  }

  div.order-body {
    padding: 5%;
    margin: 5% 0 5% 0;
    background-color: white;
  }

  p {
    margin: 0;
  }

  hr {
    margin: 12px 0;
  }
</style>
